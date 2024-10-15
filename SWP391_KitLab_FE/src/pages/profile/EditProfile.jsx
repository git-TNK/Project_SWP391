import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  if (account.role != "Customer") {
    navigate("*");
  }

  return <div>Edit profile</div>;
}

export default EditProfile;
