import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@shared/components';
import { Button } from '@shared/ui/button';
import { ArrowLeft, Calendar, MapPin, Users, Download, Edit, Trash2 } from 'lucide-react';
import { useEventsStore } from '../store/eventsStore';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ViewCardModal } from '@profile/components/SavedCards/ViewCardModal';
import { toast } from 'sonner';
import { useSavedCardsStore } from '@profile/store/savedCardsStore';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById, deleteEvent } = useEventsStore();
  const { contacts } = useNetworkContactsStore();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const { savedCards } = useSavedCardsStore();
  
  const event = eventId ? getEventById(eventId) : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
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

  const handleDeleteEvent = () => {
    if (confirm('Are you sure you want to delete this event? This will not delete the contacts.')) {
      deleteEvent(event.id);
      toast.success('Event deleted successfully');
      navigate('/events');
    }
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

  const selectedContact = eventContacts.find(c => c.id === selectedContactId);
  const selectedCard = selectedContact ? savedCards.find(card => card.id === selectedContact.profileCardId) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/events')}
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-sm"
              onClick={() => toast.info('Edit functionality coming soon')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDeleteEvent}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          {/* Event Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-lg p-6 shadow-lg mb-8"
          >
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{eventContacts.length} Contact{eventContacts.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {event.description && (
              <p className="text-muted-foreground mb-6">{event.description}</p>
            )}

            <Button onClick={handleExportContacts} disabled={eventContacts.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Contacts
            </Button>
          </motion.div>

          {/* Contacts Section */}
          <div className="pb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Contacts from this Event</h2>
            </div>

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
                      className="bg-card border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold group-hover:scale-110 transition-transform">
                          {contact.contactName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{contact.contactName}</h3>
                          {contact.title && (
                            <p className="text-sm text-muted-foreground truncate">{contact.title}</p>
                          )}
                          {contact.company && (
                            <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                          )}
                        </div>
                      </div>
                      
                      {contact.email && (
                        <p className="text-xs text-muted-foreground mt-3 truncate">{contact.email}</p>
                      )}
                      
                      {contactCard && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-xs text-primary">View Business Card →</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Contacts Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding contacts and tag them with "{event.name}"
                </p>
                <Button onClick={() => navigate('/contacts')}>
                  Go to Contacts
                </Button>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default EventDetailPage;
