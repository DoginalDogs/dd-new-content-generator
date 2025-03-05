// Dashboard.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  backgrounds as predefinedBackgrounds,
  getUserUploadedBackgrounds,
  saveUserUploadedBackgrounds,
  BackgroundItem,
} from '../data/backgroundsData';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { images } from '../data/imageData';

const Dashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/dashboard-login');
  };

  const [selectedMenu, setSelectedMenu] = useState<'fixed' | 'animated'>('fixed');

  // State for all backgrounds (predefined + user-uploaded)
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);

  // State for upload modal visibility
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // State for new asset details
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<'static' | 'animated'>('static');
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [newAssetIsTransparent, setNewAssetIsTransparent] = useState(false);
  const [newAssetIsSolidColor, setNewAssetIsSolidColor] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    // Load predefined and user-uploaded backgrounds
    const userBackgrounds = getUserUploadedBackgrounds();
    setBackgrounds([...predefinedBackgrounds, ...userBackgrounds]);
  }, []);

  // Function to open upload modal
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  // Function to close upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setNewAssetName('');
    setNewAssetFile(null);
    setUploadError('');
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/gif') {
        setNewAssetFile(file);
      } else {
        setUploadError('Only PNG and GIF files are allowed.');
      }
    }
  };

  // Handle asset upload
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    // Read the file as a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;

      // Create a new BackgroundItem
      const newBackground: BackgroundItem = {
        id: uuidv4(),
        name: newAssetName.trim() || newAssetFile.name,
        type: newAssetType,
        isTransparent: newAssetIsTransparent,
        isSolidColor: newAssetIsSolidColor,
        src: dataUrl, // Using data URL for simplicity
        isUserUploaded: true,
      };

      // Update state and Local Storage
      const updatedBackgrounds = [...backgrounds, newBackground];
      setBackgrounds(updatedBackgrounds);

      const userBackgrounds = getUserUploadedBackgrounds();
      saveUserUploadedBackgrounds([...userBackgrounds, newBackground]);

      // Reset form and close modal
      closeUploadModal();
    };
    reader.readAsDataURL(newAssetFile);
  };

  // Handle asset deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const updatedBackgrounds = backgrounds.filter((bg) => bg.id !== id);
      setBackgrounds(updatedBackgrounds);

      // Update user-uploaded backgrounds in Local Storage
      const userBackgrounds = getUserUploadedBackgrounds().filter((bg) => bg.id !== id);
      saveUserUploadedBackgrounds(userBackgrounds);
    }
  };

  // Filter backgrounds based on selected menu
  const displayedBackgrounds = backgrounds.filter(
    (bg) =>
      (selectedMenu === 'fixed' && bg.type === 'static') ||
      (selectedMenu === 'animated' && bg.type === 'animated')
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <img
          loading="lazy"
          src={images.logo}
          alt="Logo"
          className="w-52"
        />
        <div className="flex items-center space-x-4">
          <button
            onClick={openUploadModal}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Upload Asset
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-3/10 bg-gray-200 p-4">
          <ul>
            <li
              className={`mb-2 cursor-pointer ${
                selectedMenu === 'fixed' ? 'font-bold' : ''
              }`}
              onClick={() => setSelectedMenu('fixed')}
            >
              Fixed Backgrounds
            </li>
            <li
              className={`cursor-pointer ${
                selectedMenu === 'animated' ? 'font-bold' : ''
              }`}
              onClick={() => setSelectedMenu('animated')}
            >
              Animated Backgrounds
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="w-7/10 p-4 overflow-auto">
          {/* Preview Images */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {displayedBackgrounds.map((bg) => (
              <div key={bg.id} className="border p-2 relative">
                <img
                  src={bg.src}
                  alt={bg.name}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center">{bg.name}</p>
                {bg.isUserUploaded && (
                  <button
                    onClick={() => handleDelete(bg.id)}
                    className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    title="Delete Asset"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h2 className="mb-4 text-xl font-bold">Upload New Asset</h2>
            {uploadError && <p className="mb-2 text-red-500">{uploadError}</p>}
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Optional: Enter asset name"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Type</label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as 'static' | 'animated')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="static">Static</option>
                  <option value="animated">Animated</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">File</label>
                <input
                  type="file"
                  accept="image/png, image/gif"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="transparent"
                  checked={newAssetIsTransparent}
                  onChange={(e) => setNewAssetIsTransparent(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="transparent" className="text-gray-700">
                  Transparent Background
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="solidColor"
                  checked={newAssetIsSolidColor}
                  onChange={(e) => setNewAssetIsSolidColor(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="solidColor" className="text-gray-700">
                  Solid Color
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
