import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import api from '../utils/api';

const LinkBank = ({ onSuccessLink }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const { data } = await api.post('/plaid/create-link-token');
        setToken(data.link_token);
      } catch (error) {
        console.error('Error fetching link token via API', error);
      }
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (public_token, metadata) => {
    try {
      await api.post('/plaid/set-access-token', { public_token });
      if (onSuccessLink) {
        onSuccessLink();
      }
      alert('Bank connected securely!');
    } catch (error) {
      console.error('Error setting access token:', error);
      alert('Failed to connect bank: ' + (error.response?.data?.message || error.response?.data?.details?.error_message || error.message));
    }
  }, [onSuccessLink]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="px-4 py-2 bg-brand-600/20 text-brand-400 hover:bg-brand-600/40 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium border border-brand-500/20 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {ready ? 'Initialize Connection' : 'Loading Service...'}
    </button>
  );
};

export default LinkBank;
