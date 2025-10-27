import { useCardStore } from "@/store/cardStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export const FrontFields = () => {
  const { cardData, updateCardData } = useCardStore();

  const onProfileDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        updateCardData({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [updateCardData]);

  const onLogoDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        updateCardData({ companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [updateCardData]);

  const profileDropzone = useDropzone({
    onDrop: onProfileDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const logoDropzone = useDropzone({
    onDrop: onLogoDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Front Side</h2>
      </div>

      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Personal Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={cardData.fullName}
            onChange={(e) => updateCardData({ fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Title</Label>
          <Input
            id="role"
            value={cardData.role}
            onChange={(e) => updateCardData({ role: e.target.value })}
            placeholder="Founder / Director"
          />
        </div>

        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div
            {...profileDropzone.getRootProps()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent transition-colors"
          >
            <input {...profileDropzone.getInputProps()} />
            {cardData.profileImage ? (
              <div className="space-y-2">
                <img
                  src={cardData.profileImage}
                  alt="Profile"
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                />
                <p className="text-xs text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Drop image or click to upload</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="grayscale"
            checked={cardData.grayscale}
            onCheckedChange={(checked) => updateCardData({ grayscale: checked })}
          />
          <Label htmlFor="grayscale">Grayscale Effect</Label>
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Company Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={cardData.companyName}
            onChange={(e) => updateCardData({ companyName: e.target.value })}
            placeholder="YOURCOMPANY"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company Website</Label>
          <Input
            id="companyWebsite"
            value={cardData.companyWebsite}
            onChange={(e) => updateCardData({ companyWebsite: e.target.value })}
            placeholder="www.yourcompany.co"
          />
        </div>

        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div
            {...logoDropzone.getRootProps()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent transition-colors"
          >
            <input {...logoDropzone.getInputProps()} />
            {cardData.companyLogo ? (
              <div className="space-y-2">
                <img
                  src={cardData.companyLogo}
                  alt="Logo"
                  className="w-16 h-16 object-contain mx-auto"
                />
                <p className="text-xs text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Drop logo or click to upload</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showLogo"
            checked={cardData.showLogo}
            onCheckedChange={(checked) => updateCardData({ showLogo: checked })}
          />
          <Label htmlFor="showLogo">Show Company Logo</Label>
        </div>
      </div>
    </div>
  );
};
