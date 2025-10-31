import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEventsStore } from '@/store/eventsStore';
import { toast } from 'sonner';
import conferenceDefault from '@/assets/event-banners/conference-default.jpg';
import meetupDefault from '@/assets/event-banners/meetup-default.jpg';
import workshopDefault from '@/assets/event-banners/workshop-default.jpg';
import seminarDefault from '@/assets/event-banners/seminar-default.jpg';
import tradeshowDefault from '@/assets/event-banners/tradeshow-default.jpg';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultBanners = [
  { id: 'conference', label: 'Conference', url: conferenceDefault },
  { id: 'meetup', label: 'Meetup', url: meetupDefault },
  { id: 'workshop', label: 'Workshop', url: workshopDefault },
  { id: 'seminar', label: 'Seminar', url: seminarDefault },
  { id: 'tradeshow', label: 'Trade Show', url: tradeshowDefault },
];

export const AddEventDialog = ({ open, onOpenChange }: AddEventDialogProps) => {
  const { addEvent } = useEventsStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>();
  const [imageUrl, setImageUrl] = useState('');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
        setSelectedBanner(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBanner = (bannerId: string, url: string) => {
    setSelectedBanner(bannerId);
    setCustomImage(null);
    setImageUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !date) {
      toast.error('Please fill in event name and date');
      return;
    }

    const finalImageUrl = customImage || imageUrl || defaultBanners[0].url;

    addEvent({
      name,
      description,
      location,
      date: date.toISOString(),
      imageUrl: finalImageUrl,
    });

    toast.success('Event created successfully!');
    
    // Reset form
    setName('');
    setDescription('');
    setLocation('');
    setDate(undefined);
    setImageUrl('');
    setCustomImage(null);
    setSelectedBanner(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add event details and choose a banner image for your event
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Banner Selection */}
          <div className="space-y-3">
            <Label>Event Banner</Label>
            
            {/* Custom Upload */}
            <div className="flex items-center gap-3">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label
                htmlFor="image-upload"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors",
                  customImage && "border-primary bg-accent"
                )}
              >
                <Upload className="h-4 w-4" />
                Upload Custom Image
              </Label>
              {customImage && (
                <span className="text-sm text-muted-foreground">Custom image uploaded</span>
              )}
            </div>

            {/* Default Banners */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {defaultBanners.map((banner) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => handleSelectBanner(banner.id, banner.url)}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    selectedBanner === banner.id ? "border-primary shadow-lg" : "border-border"
                  )}
                >
                  <img
                    src={banner.url}
                    alt={banner.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{banner.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview */}
            {(customImage || selectedBanner) && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={customImage || imageUrl}
                  alt="Preview"
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tech Conference 2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-date">Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Convention Center, San Francisco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add event details, agenda, or notes..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
