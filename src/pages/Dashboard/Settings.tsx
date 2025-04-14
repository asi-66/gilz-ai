
import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState({
    name: "HR Admin",
    email: "hr@example.com",
    company: "TNP Consultants",
    phone: "+1 (555) 123-4567",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    candidateUpdates: true,
    marketingEmails: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Notification preferences saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="text-gray-800 dark:text-gray-200">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">HR</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-2 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profileData.company}
                          onChange={handleProfileChange}
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4">
            <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive email notifications for important updates
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          handleNotificationChange("emailNotifications", checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Job Flow Alerts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified when job flows are created or updated
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.jobAlerts}
                        onCheckedChange={(checked) => 
                          handleNotificationChange("jobAlerts", checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Candidate Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications about candidate evaluations
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.candidateUpdates}
                        onCheckedChange={(checked) => 
                          handleNotificationChange("candidateUpdates", checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Marketing Emails</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates about new features and promotional offers
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          handleNotificationChange("marketingEmails", checked)
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-4">
            <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Account Settings</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2 md:w-1/2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 md:w-1/2">
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => {}}>
                      <Save className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
