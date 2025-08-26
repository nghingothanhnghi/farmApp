import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Form, { FormGroup, FormLabel, FormInput, FormActions } from '../common/Form';
import Button from '../common/Button';
import PageTitle from '../common/PageTitle';
import { useAlert } from '../../contexts/alertContext';
import { useAuth } from '../../contexts/authContext';
import * as Yup from 'yup';
import { updateUser, uploadUserImage } from '../../services/userService';
import { getUserImageUrl } from '../../utils/getUserImageUrl';
import Avatar from '../common/Avatar';

const EditUserPage: React.FC = () => {
  const { user, getUser, setShowLoginModal } = useAuth();
  const { setAlert } = useAlert();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fields: [keyof typeof formData, string, string, boolean][] = [
    ['username', 'Username', 'text', true],
    ['email', 'Email', 'email', true],
    ['phone_number', 'Phone Number', 'text', false],
    ['first_name', 'First Name', 'text', false],
    ['last_name', 'Last Name', 'text', false],
  ];

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone_number: user.phoneNumber || '',
      first_name: user.firstName || '',
      last_name: user.lastName || '',
    });
    if (user.image_url) {
      setPreviewUrl(getUserImageUrl(user.image_url)); // ✅ normalize here
    }
  }, [user, id]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone_number: Yup.string().optional(),
    first_name: Yup.string().optional(),
    last_name: Yup.string().optional(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFieldErrors({});
      if (!user) throw new Error('No user context');

      await updateUser(user.id, formData);

      // upload image if selected
      if (selectedImage) {
        const uploadResp = await uploadUserImage(user.id, selectedImage);

        // if backend returns image filename/url, update preview immediately
        if (uploadResp?.image_url) {
          setPreviewUrl(getUserImageUrl(uploadResp.image_url));
        }
      }


      await getUser(); // refresh AuthContext with new data

      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach(error => {
          if (error.path) errors[error.path] = error.message;
        });
        setFieldErrors(errors);
      } else {
        setAlert({
          type: 'error',
          message: err?.response?.data?.detail || 'Update failed',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle title="Edit Profile" />
      <Form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <Avatar
            imageUrl={previewUrl || user?.image_url}
            size={128}
            rounded="full"
            className="mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          
        </div>
        {fields.map(([name, label, type, required]) => (
          <FormGroup key={name} className="grid gap-x-8 gap-y-1 sm:gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <FormLabel htmlFor={name}>{label}</FormLabel>
            </div>
            <div>
              <FormInput
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required={required}
              />
              {fieldErrors[name] && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
              )}
            </div>
          </FormGroup>
        ))}
        <hr className="my-10 border-t border-zinc-950/5 dark:border-white/5" />
        <FormActions className="lg:static fixed bottom-0 left-0 right-0 p-4 lg:pl-4 lg:pr-0 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            type="submit"
            label={loading ? 'Saving...' : 'Save Changes'}
            disabled={loading}
            variant="primary"
            rounded='lg'
          />
        </FormActions>
      </Form>
    </div>
  );
};

export default EditUserPage;
