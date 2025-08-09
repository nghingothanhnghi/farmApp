import React from 'react';
import ListLink from '../../common/ListLink';
import { IconMinus } from '@tabler/icons-react';

interface Props {
    availableModels: string[];
    selectedModel: string;
    onSelect: (model: string) => void;
    onDeleteRequest: (model: string) => void;
}

const ModelSelector: React.FC<Props> = ({ availableModels, selectedModel, onSelect, onDeleteRequest }) => (
    <div className="model-selector space-y-2 mt-4">
        <h3 className="font-semibold text-sm mb-1">Available Models</h3>
        {availableModels.map((model) => (
            <div key={model} className="flex items-center justify-between">
                <ListLink
                    to="#"
                    label={model}
                    icon={<span className="w-4 h-4 rounded-full bg-blue-500" />}
                    active={selectedModel === model}
                    onClick={() => onSelect(model)}
                />
                {model !== 'default' && (
                    <button onClick={() => onDeleteRequest(model)} className="text-red-500 hover:text-red-700 ml-2">
                        <IconMinus size={18} />
                    </button>
                )}
            </div>
        ))}
        {availableModels.length > 0 && (<div className="model-selector">
            <label htmlFor="model-select">Model:</label>
            <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onSelect(e.target.value)}
            >
                {availableModels.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                ))}
            </select>
        </div>
        )}
    </div>
);

export default ModelSelector;
