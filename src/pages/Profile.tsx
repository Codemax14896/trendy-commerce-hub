
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";

const Profile = () => {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    
    setUpdatingProfile(true);
    
    try {
      await updateUserProfile(displayName);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setUpdatingEmail(true);
    
    try {
      await updateUserEmail(email);
      toast.success("Email updated successfully");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setUpdatingPassword(true);
    
    try {
      await updateUserPassword(password);
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-tnTrendy-purple-dark mb-4">
              You are not logged in
            </h2>
            <p className="text-tnTrendy-gray mb-6">
              Please log in to view and edit your profile.
            </p>
            <Button 
              onClick={() => window.location.href = "/login"} 
              className="btn-primary"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-8">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-tnTrendy-purple-dark">Account Settings</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
                <div className="flex items-center">
                  <div className="bg-tnTrendy-purple-soft text-tnTrendy-purple-vivid rounded-full p-3 mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-tnTrendy-purple-dark">
                      Profile Information
                    </h3>
                    <p className="text-sm text-tnTrendy-gray">
                      Update your display name and profile details
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={updatingProfile}
                    >
                      {updatingProfile ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="email">
              <form onSubmit={handleUpdateEmail} className="space-y-6 py-4">
                <div className="flex items-center">
                  <div className="bg-tnTrendy-purple-soft text-tnTrendy-purple-vivid rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-tnTrendy-purple-dark">
                      Email Address
                    </h3>
                    <p className="text-sm text-tnTrendy-gray">
                      Update your email address
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={updatingEmail}
                    >
                      {updatingEmail ? "Updating..." : "Update Email"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={handleUpdatePassword} className="space-y-6 py-4">
                <div className="flex items-center">
                  <div className="bg-tnTrendy-purple-soft text-tnTrendy-purple-vivid rounded-full p-3 mr-4">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-tnTrendy-purple-dark">
                      Password
                    </h3>
                    <p className="text-sm text-tnTrendy-gray">
                      Update your password
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={updatingPassword}
                    >
                      {updatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
