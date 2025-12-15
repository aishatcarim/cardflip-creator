import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '@shared/components';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Checkbox } from '@shared/ui/checkbox';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';
import { Label } from '@shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { ScrollArea } from '@shared/ui/scroll-area';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  Edit, 
  Trash2, 
  Target, 
  CheckCircle2, 
  Plus,
  TrendingUp,
  MessageSquare,
  Send,
  ImageIcon,
  Upload,
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MoreHorizontal,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useEventsStore } from '../store/eventsStore';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useRef, useEffect } from 'react';
import { ViewCardModal } from '@profile/components/SavedCards/ViewCardModal';
import { toast } from 'sonner';
import { useSavedCardsStore } from '@profile/store/savedCardsStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import defaultBanner from '@/assets/event-banners/conference-default.jpg';

interface EventGoal {
  id: string;
  title: string;
  completed: boolean;
  category: 'preparation' | 'networking' | 'followup';
  priority?: 'low' | 'medium' | 'high';
}

interface EditEventForm {
  name: string;
  description: string;
  date: string;
  location: string;
}

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById, deleteEvent, updateEvent } = useEventsStore();
  const { contacts } = useNetworkContactsStore();
  const { savedCards } = useSavedCardsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteBannerDialog, setShowDeleteBannerDialog] = useState(false);
  const [showEditBannerDialog, setShowEditBannerDialog] = useState(false);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'goals'>('overview');
  const [newBannerPreview, setNewBannerPreview] = useState<string | null>(null);
  const [selectedGoalCategory, setSelectedGoalCategory] = useState<'preparation' | 'networking' | 'followup'>('preparation');
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditEventForm>({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  // Mock goals state - in real app, this would come from store
  const [eventGoals, setEventGoals] = useState<EventGoal[]>([
    { id: '1', title: 'Prepare business cards (50 cards)', completed: true, category: 'preparation', priority: 'high' },
    { id: '2', title: 'Research attending companies', completed: true, category: 'preparation', priority: 'medium' },
    { id: '3', title: 'Set networking goal: Connect with 15 people', completed: false, category: 'networking', priority: 'high' },
    { id: '4', title: 'Identify 3 potential collaborators', completed: false, category: 'networking', priority: 'medium' },
    { id: '5', title: 'Schedule follow-up calls within 48 hours', completed: false, category: 'followup', priority: 'high' },
    { id: '6', title: 'Send personalized thank you emails', completed: false, category: 'followup', priority: 'medium' },
  ]);

  const locationEvent = location.state?.event;
  const event = locationEvent ?? (eventId ? getEventById(eventId) : null);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
            <Button onClick={() => navigate('/events')} className="gap-2 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const eventContacts = contacts.filter(
    (contact) => contact.event?.toLowerCase() === event.name.toLowerCase()
  );

  // Calculate goal statistics
  const goalStats = useMemo(() => {
    const total = eventGoals.length;
    const completed = eventGoals.filter(g => g.completed).length;
    const byCategory = {
      preparation: eventGoals.filter(g => g.category === 'preparation'),
      networking: eventGoals.filter(g => g.category === 'networking'),
      followup: eventGoals.filter(g => g.category === 'followup'),
    };
    return {
      total,
      completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
    };
  }, [eventGoals]);

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/events');
    setShowDeleteDialog(false);
  };

  const handleExportContacts = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Company', 'Title', 'Notes', 'Tagged At'],
      ...eventContacts.map(contact => [
        contact.contactName,
        contact.email || '',
        contact.phone || '',
        contact.company || '',
        contact.title || '',
        contact.notes || '',
        contact.taggedAt || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.name}-contacts.csv`;
    a.click();
    toast.success('Contacts exported successfully!');
  };

  const toggleGoal = (goalId: string) => {
    setEventGoals(prev =>
      prev.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const addGoal = (title: string, category: 'preparation' | 'networking' | 'followup', priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!title.trim()) return;
    
    const newGoal: EventGoal = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
      priority,
    };
    
    setEventGoals(prev => [...prev, newGoal]);
    toast.success('Goal added successfully!');
  };

  const deleteGoal = (goalId: string) => {
    setEventGoals(prev => prev.filter(g => g.id !== goalId));
    toast.success('Goal removed');
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = () => {
    if (newBannerPreview) {
      updateEvent(event.id, { imageUrl: newBannerPreview });
      toast.success('Banner updated successfully!');
      setShowEditBannerDialog(false);
      setNewBannerPreview(null);
    }
  };

  const handleDeleteBanner = () => {
    updateEvent(event.id, { imageUrl: undefined });
    toast.success('Banner removed');
    setShowDeleteBannerDialog(false);
  };

  const selectedContact = eventContacts.find(c => c.id === selectedContactId);
  const selectedCard = selectedContact ? savedCards.find(card => card.id === selectedContact.profileCardId) : null;

  const bannerImage = event.imageUrl || defaultBanner;

  // Initialize edit form when opening the dialog
  const openEditEventDialog = () => {
    setEditForm({
      name: event.name,
      description: event.description || '',
      date: event.date,
      location: event.location || '',
    });
    setShowEditEventDialog(true);
  };

  const handleSaveEvent = () => {
    if (!editForm.name.trim()) {
      toast.error('Event name is required');
      return;
    }
    if (!editForm.date) {
      toast.error('Event date is required');
      return;
    }

    setIsSaving(true);
    
    // Simulate a brief save delay for UX
    setTimeout(() => {
      updateEvent(event.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || undefined,
        date: editForm.date,
        location: editForm.location.trim() || undefined,
      });
      
      toast.success('Event updated successfully!');
      setShowEditEventDialog(false);
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1">
        {/* Professional Banner Section */}
        <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden group">
          <img
            src={bannerImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/events')}
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Banner Actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 bg-background/90 backdrop-blur-sm shadow-lg"
              onClick={() => setShowEditBannerDialog(true)}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Edit Banner
            </Button>
            {event.imageUrl && (
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowDeleteBannerDialog(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </Badge>
                    {event.location && (
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {event.name}
                  </h1>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm rounded-full shadow-lg"
                    onClick={openEditEventDialog}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Contacts</p>
                  <p className="text-2xl font-bold">{eventContacts.length}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Goals</p>
                  <p className="text-2xl font-bold">{goalStats.completed}<span className="text-sm text-muted-foreground font-normal">/{goalStats.total}</span></p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Progress</p>
                  <p className="text-2xl font-bold">{goalStats.progress}<span className="text-sm text-muted-foreground font-normal">%</span></p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <TabsList className="bg-transparent p-0 h-auto gap-6">
                <TabsTrigger
                  value="overview"
                  className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                  <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5 text-xs">
                    {eventContacts.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  className="bg-transparent px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Goals
                  <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5 text-xs">
                    {goalStats.completed}/{goalStats.total}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <Button
                onClick={handleExportContacts}
                disabled={eventContacts.length === 0}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">Event Details</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    {event.location && (
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                    )}

                    {event.description && (
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Goal Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-border bg-card"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Goal Progress</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('goals')}
                      className="text-xs h-7"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="p-4 space-y-4">
                    {Object.entries(goalStats.byCategory).map(([category, goals]) => {
                      const completed = goals.filter(g => g.completed).length;
                      const total = goals.length;
                      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium capitalize">{category}</span>
                            <span className="text-xs text-muted-foreground">
                              {completed}/{total}
                            </span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>

                  {goalStats.completed === goalStats.total && goalStats.total > 0 && (
                    <div className="mx-4 mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">All goals completed!</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Recent Contacts Preview */}
              {eventContacts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-card"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Recent Contacts</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('contacts')}
                      className="text-xs h-7"
                    >
                      View All ({eventContacts.length})
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {eventContacts.slice(0, 6).map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContactId(contact.id)}
                          className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                              {contact.contactName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{contact.contactName}</p>
                              {contact.company && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {contact.company}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-4 mt-0">
              {eventContacts.length > 0 ? (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">All Contacts</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {eventContacts.length} contact{eventContacts.length !== 1 ? 's' : ''} from this event
                      </p>
                    </div>
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-border">
                      {eventContacts.map((contact, index) => {
                        const contactCard = savedCards.find(card => card.id === contact.profileCardId);
                        
                        return (
                          <motion.div
                            key={contact.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="p-4 hover:bg-accent/30 transition-colors cursor-pointer group"
                            onClick={() => setSelectedContactId(contact.id)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                                {contact.contactName.charAt(0).toUpperCase()}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-semibold text-sm">{contact.contactName}</h4>
                                    {contact.title && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Briefcase className="h-3 w-3" />
                                        {contact.title}
                                      </p>
                                    )}
                                  </div>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => navigate(`/contacts/${contact.id}`)}>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      {contact.email && (
                                        <DropdownMenuItem onClick={() => window.open(`mailto:${contact.email}`)}>
                                          <Mail className="h-4 w-4 mr-2" />
                                          Send Email
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  {contact.company && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      {contact.company}
                                    </span>
                                  )}
                                  {contact.email && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {contact.email}
                                    </span>
                                  )}
                                  {contact.phone && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {contact.phone}
                                    </span>
                                  )}
                                </div>

                                {contactCard && (
                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Business Card Available
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">No Contacts Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start adding contacts and tag them with "{event.name}"
                  </p>
                  <Button onClick={() => navigate('/contacts')} size="sm" className="gap-2">
                    Go to Contacts
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6 mt-0">
              {/* Quick Add Goal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <QuickAddGoal 
                  onAdd={addGoal}
                  selectedCategory={selectedGoalCategory}
                  setSelectedCategory={setSelectedGoalCategory}
                />
              </motion.div>

              {/* Goals by Category */}
              <div className="grid gap-4 lg:grid-cols-3">
                {(['preparation', 'networking', 'followup'] as const).map((category, idx) => (
                  <GoalCategory
                    key={category}
                    title={category === 'followup' ? 'Follow-up' : category.charAt(0).toUpperCase() + category.slice(1)}
                    category={category}
                    goals={goalStats.byCategory[category]}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                    delay={idx * 0.1}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* View Card Modal */}
      {selectedCard && selectedContact && (
        <ViewCardModal
          cardData={selectedCard.cardData}
          open={!!selectedContactId}
          onOpenChange={(open) => !open && setSelectedContactId(null)}
        />
      )}

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{event.name}". Your contacts will not be deleted.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Banner Confirmation Dialog */}
      <AlertDialog open={showDeleteBannerDialog} onOpenChange={setShowDeleteBannerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Banner Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the custom banner image for this event. A default banner will be shown instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBanner}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Banner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Banner Dialog */}
      <Dialog open={showEditBannerDialog} onOpenChange={setShowEditBannerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Banner Image</DialogTitle>
            <DialogDescription>
              Upload a new banner image for this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerFileChange}
              className="hidden"
            />
            
            {newBannerPreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-[3/1]">
                <img
                  src={newBannerPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => setNewBannerPreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditBannerDialog(false);
              setNewBannerPreview(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} disabled={!newBannerPreview}>
              Save Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditEventDialog} onOpenChange={setShowEditEventDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                placeholder="Enter event name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-date">Date *</Label>
              <Input
                id="event-date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="Enter location"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Enter event description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditEventDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              disabled={isSaving || !editForm.name.trim() || !editForm.date}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Quick Add Goal Component
interface QuickAddGoalProps {
  onAdd: (title: string, category: 'preparation' | 'networking' | 'followup', priority: 'low' | 'medium' | 'high') => void;
  selectedCategory: 'preparation' | 'networking' | 'followup';
  setSelectedCategory: (category: 'preparation' | 'networking' | 'followup') => void;
}

const QuickAddGoal = ({ onAdd, selectedCategory, setSelectedCategory }: QuickAddGoalProps) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title, selectedCategory, priority);
    setTitle('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Quick Add Goal</span>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter goal title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={!title.trim()} size="sm">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {(['preparation', 'networking', 'followup'] as const).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'followup' ? 'Follow-up' : cat}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-1 ml-auto">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <Button
              key={p}
              variant={priority === p ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs h-7 capitalize"
              onClick={() => setPriority(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Goal Category Component
interface GoalCategoryProps {
  title: string;
  category: 'preparation' | 'networking' | 'followup';
  goals: EventGoal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const GoalCategory = ({
  title,
  category,
  goals,
  onToggle,
  onDelete,
  delay = 0,
}: GoalCategoryProps) => {
  const completed = goals.filter(g => g.completed).length;
  const total = goals.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categoryIcons = {
    preparation: Calendar,
    networking: Users,
    followup: Send,
  };
  
  const Icon = categoryIcons[category];

  const priorityColors = {
    low: 'bg-slate-500/10 text-slate-500',
    medium: 'bg-amber-500/10 text-amber-500',
    high: 'bg-red-500/10 text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {completed}/{total}
          </Badge>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <ScrollArea className="h-[280px]">
        <div className="p-2">
          <AnimatePresence>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={() => onToggle(goal.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </p>
                    {goal.priority && (
                      <Badge variant="outline" className={`text-[10px] mt-1 ${priorityColors[goal.priority]}`}>
                        {goal.priority}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => onDelete(goal.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No goals yet
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default EventDetailPage;
