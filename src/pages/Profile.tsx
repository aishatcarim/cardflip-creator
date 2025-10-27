import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main page with saved cards tab
    navigate("/");
  }, [navigate]);

  return null;
};

export default Profile;
