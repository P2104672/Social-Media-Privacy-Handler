import { useEffect, useState } from 'react';
import useGoogleAuth from '../components/useGoogleAuth';
import { fetchConnectedAccounts, connectSocialMedia } from '../api/SocialMediaApi';
import './Profile.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import * as FaIcons from 'react-icons/fa';
const clientId = "544721700557-k663mu7847o4a1bctnuq5jh104qe982h.apps.googleusercontent.com";
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Profile = () => {
	const { user, isLoading, onSuccess } = useGoogleAuth(clientId);
	const [connectedAccounts, setConnectedAccounts] = useState([]);

	useEffect(() => {
		if (user) {
			loadConnectedAccounts(user.email);
		}
	}, [user]);

	const loadConnectedAccounts = async (email) => {
		try {
			const accounts = await fetchConnectedAccounts(email);
			// Ensure accounts is always an array
			setConnectedAccounts(Array.isArray(accounts) ? accounts : []);
		} catch (error) {
			console.error('Error fetching connected accounts:', error);
			setConnectedAccounts([]); // Set to empty array on error
		}
	};

	const handleConnectPlatform = async (platform) => {
		if (!user) return;
		try {
			await connectSocialMedia(user.email, platform);
			await loadConnectedAccounts(user.email);
		} catch (error) {
			console.error(`Error connecting to ${platform}:`, error);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='profile-container'>
			<Sidebar />
			<h1>Profile</h1>
			<div className="profile">
				{user ? (
					<>
						<h2>Welcome, {user.name}!</h2>
						<p>Email: {user.email}</p>
						<div className="profile-picture-placeholder">
							<i className="fas fa-user-circle"></i>
						</div>
						<h3>Connected Accounts:</h3>
						{Array.isArray(connectedAccounts) && connectedAccounts.length > 0 ? (
							<ul>
								{connectedAccounts.map((account, index) => (
									<li key={index}>{account}</li>
								))}
							</ul>
						) : (
							<p>No connected social media accounts.</p>
						)}
						<h3>Connect More Accounts:</h3>
						<div className="connect-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
							{['Facebook', 'Instagram', 'X', 'LinkedIn'].map(platform => (
								<button 
									key={platform} 
									onClick={() => handleConnectPlatform(platform)}
									className={`connect-btn ${platform.toLowerCase()}`}
									style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
								>
									{platform === 'Facebook' && <FaIcons.FaFacebook />}
									{platform === 'Instagram' && <FaIcons.FaInstagram />}
									{platform === 'X' && <FontAwesomeIcon icon={faXTwitter} /> }
									{platform === 'LinkedIn' && <FaIcons.FaLinkedin />}
									<span style={{ marginLeft: '8px' }}>Connect {platform}</span>
								</button>
							))}
						</div>
						</>
				) : (
					<div>
						<p>Please sign in to view your profile.</p>
						<button onClick={onSuccess} className="google-signin-btn">
							Sign in with Google
						</button>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Profile;
