import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '@shared/components';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Checkbox } from '@shared/ui/checkbox';
import { Input } from '@shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
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
  BarChart3
} from 'lucide-react';
import { useEventsStore } from '../store/eventsStore';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
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

interface EventGoal {
  id: string;
  title: string;
  completed: boolean;
  category: 'preparation' | 'networking' | 'followup';
}

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getEventById, deleteEvent } = useEventsStore();
  const { contacts } = useNetworkContactsStore();
  const { savedCards } = useSavedCardsStore();

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'goals'>('overview');

  // Mock goals state - in real app, this would come from store
  const [eventGoals, setEventGoals] = useState<EventGoal[]>([
    { id: '1', title: 'Prepare business cards (50 cards)', completed: true, category: 'preparation' },
    { id: '2', title: 'Research attending companies', completed: true, category: 'preparation' },
    { id: '3', title: 'Set networking goal: Connect with 15 people', completed: false, category: 'networking' },
    { id: '4', title: 'Identify 3 potential collaborators', completed: false, category: 'networking' },
    { id: '5', title: 'Schedule follow-up calls within 48 hours', completed: false, category: 'followup' },
    { id: '6', title: 'Send personalized thank you emails', completed: false, category: 'followup' },
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

  const addGoal = (category: 'preparation' | 'networking' | 'followup') => {
    if (!newGoalTitle.trim()) return;
    
    const newGoal: EventGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      completed: false,
      category,
    };
    
    setEventGoals(prev => [...prev, newGoal]);
    setNewGoalTitle('');
    toast.success('Goal added successfully!');
  };

  const deleteGoal = (goalId: string) => {
    setEventGoals(prev => prev.filter(g => g.id !== goalId));
    toast.success('Goal removed');
  };

  const selectedContact = eventContacts.find(c => c.id === selectedContactId);
  const selectedCard = selectedContact ? savedCards.find(card => card.id === selectedContact.profileCardId) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/events')}
            className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/90 backdrop-blur-sm rounded-full shadow-lg"
              onClick={() => toast.info('Edit functionality coming soon')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-20 left-8 right-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 relative z-10 pb-20 max-w-7xl">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contacts</p>
                  <p className="text-3xl font-bold">{eventContacts.length}</p>
                </div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                Collected at event
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Goals</p>
                  <p className="text-3xl font-bold">{goalStats.completed}/{goalStats.total}</p>
                </div>
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <Progress value={goalStats.progress} className="h-1.5 mt-2" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                  <p className="text-lg font-bold">
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground">
                {event.location || 'No location set'}
              </p>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50 p-1 rounded-full">
                <TabsTrigger
                  value="overview"
                  className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                  <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                    {eventContacts.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Goals
                  <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                    {goalStats.completed}/{goalStats.total}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <Button
                onClick={handleExportContacts}
                disabled={eventContacts.length === 0}
                variant="outline"
                className="gap-2 rounded-full"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    {event.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                    )}

                    {event.description && (
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Quick Goal Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Goal Progress</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('goals')}
                      className="gap-2 rounded-full"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(goalStats.byCategory).map(([category, goals]) => {
                      const completed = goals.filter(g => g.completed).length;
                      const total = goals.length;
                      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium capitalize">{category}</span>
                            <span className="text-sm text-muted-foreground">
                              {completed}/{total}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  {goalStats.completed === goalStats.total && goalStats.total > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">All goals completed! 🎉</span>
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
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Contacts</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('contacts')}
                      className="gap-2 rounded-full"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventContacts.slice(0, 6).map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContactId(contact.id)}
                        className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {contact.contactName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{contact.contactName}</p>
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
                </motion.div>
              )}
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-6">
              {eventContacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {eventContacts.map((contact, index) => {
                    const contactCard = savedCards.find(card => card.id === contact.profileCardId);
                    
                    return (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedContactId(contact.id)}
                        className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold group-hover:scale-110 transition-transform">
                            {contact.contactName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{contact.contactName}</h3>
                            {contact.title && (
                              <p className="text-sm text-muted-foreground truncate">{contact.title}</p>
                            )}
                          </div>
                        </div>

                        {contact.company && (
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {contact.company}
                          </p>
                        )}
                        
                        {contact.email && (
                          <p className="text-xs text-muted-foreground truncate mb-3">
                            {contact.email}
                          </p>
                        )}
                        
                        {contactCard && (
                          <div className="pt-3 border-t border-border">
                            <span className="text-xs text-primary font-medium">
                              View Business Card →
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Contacts Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start adding contacts and tag them with "{event.name}"
                  </p>
                  <Button onClick={() => navigate('/contacts')} className="gap-2 rounded-full">
                    Go to Contacts
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Preparation Goals */}
                <GoalCategory
                  title="Preparation"
                  icon={<Calendar className="h-5 w-5" />}
                  category="preparation"
                  goals={goalStats.byCategory.preparation}
                  onToggle={toggleGoal}
                  onDelete={deleteGoal}
                  onAdd={addGoal}
                  newGoalTitle={newGoalTitle}
                  setNewGoalTitle={setNewGoalTitle}
                />

                {/* Networking Goals */}
                <GoalCategory
                  title="Networking"
                  icon={<Users className="h-5 w-5" />}
                  category="networking"
                  goals={goalStats.byCategory.networking}
                  onToggle={toggleGoal}
                  onDelete={deleteGoal}
                  onAdd={addGoal}
                  newGoalTitle={newGoalTitle}
                  setNewGoalTitle={setNewGoalTitle}
                />

                {/* Follow-up Goals */}
                <GoalCategory
                  title="Follow-up"
                  icon={<Send className="h-5 w-5" />}
                  category="followup"
                  goals={goalStats.byCategory.followup}
                  onToggle={toggleGoal}
                  onDelete={deleteGoal}
                  onAdd={addGoal}
                  newGoalTitle={newGoalTitle}
                  setNewGoalTitle={setNewGoalTitle}
                />
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

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
};

// Goal Category Component
interface GoalCategoryProps {
  title: string;
  icon: React.ReactNode;
  category: 'preparation' | 'networking' | 'followup';
  goals: EventGoal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (category: 'preparation' | 'networking' | 'followup') => void;
  newGoalTitle: string;
  setNewGoalTitle: (title: string) => void;
}

const GoalCategory = ({
  title,
  icon,
  category,
  goals,
  onToggle,
  onDelete,
  onAdd,
  newGoalTitle,
  setNewGoalTitle,
}: GoalCategoryProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const completed = goals.filter(g => g.completed).length;
  const total = goals.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAdd = () => {
    onAdd(category);
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {completed}/{total}
        </Badge>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <div className="space-y-2 mb-4">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <Checkbox
                checked={goal.completed}
                onCheckedChange={() => onToggle(goal.id)}
                className="mt-0.5"
              />
              <p className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(goal.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAdding ? (
        <div className="flex gap-2">
          <Input
            placeholder="Enter goal..."
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="text-sm"
            autoFocus
          />
          <Button size="sm" onClick={handleAdd} disabled={!newGoalTitle.trim()}>
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="w-full gap-2 rounded-full"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      )}
    </motion.div>
  );
};

export default EventDetailPage;