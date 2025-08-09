const AnnotatedImage = ({ src }: { src: string }) => (
  <div className="annotated-image">
    <h3>Processed Image</h3>
    <img src={src} alt="Annotated detection" />
  </div>
);

export default AnnotatedImage;
