
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-tnTrendy-purple-dark">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {emailSent ? (
            <div className="text-center py-6">
              <div className="bg-tnTrendy-purple-soft text-tnTrendy-purple-vivid rounded-full p-4 inline-block mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-2">
                Check Your Email
              </h3>
              <p className="text-tnTrendy-gray mb-6">
                We've sent a password reset link to <strong>{email}</strong>.<br />
                Please check your inbox and follow the instructions.
              </p>
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="mr-2"
              >
                Send Again
              </Button>
              <Link to="/login">
                <Button className="btn-primary">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-tnTrendy-purple-vivid hover:text-tnTrendy-purple-tertiary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
