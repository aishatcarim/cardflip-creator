import { useState, useMemo } from "react";
import { useNetworkContactsStore } from "@contacts/store/networkContactsStore";
import { AppHeader } from '@shared/components';
import { ContactSearchBar } from "../components/ContactsList/ContactSearchBar";
import { ContactFilters } from "../components/ContactsList/ContactFilters";
import { ContactCard } from "../components/ContactsList/ContactCard";
import { ContactTagModal } from "../components/ContactActions/ContactTagModal";
import { ExportMenu } from "../components/ContactActions/ExportMenu";
import { ContactsPriorityQueue } from "../components/ContactDashboard/ContactsPriorityQueue";
import { ContactsInsights } from "../components/ContactDashboard/ContactsInsights";
import { ContactsByEvent } from "../components/ContactDashboard/ContactsByEvent";
import { EmptyState } from '@shared/components';
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Badge } from "@shared/ui/badge";
import { Users, QrCode, UserPlus, Download, Sparkles, BarChart3, LayoutGrid, Calendar, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Dock } from '@shared/components';
import { MobileTabBar } from '@shared/components';
import { useIsMobile, useSwipe } from '@shared/hooks';
import { toast } from "sonner";
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

const ContactsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const {
    contacts,
    deleteContact,
    deleteMultipleContacts,
    exportContactsCSV,
    exportContactVCard,
    exportMultipleVCards,
  } = useNetworkContactsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);

  // Helper functions for priority calculation
  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntil = (dateString?: string) => {
    if (!dateString) return Infinity;
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Mobile swipe navigation
  useSwipe(mainContentRef, {
    onSwipeLeft: () => {
      if (isMobile) {
        navigate('/events');
      }
    },
    onSwipeRight: () => {
      if (isMobile) {
        navigate('/');
      }
    }
  });

  // Calculate priority contacts (needs attention)
  const priorityContacts = useMemo(() => {
    return contacts.filter(c => {
      const daysSince = getDaysSince(c.taggedAt);
      const isOverdue = c.followUpDueDate &&
                       new Date(c.followUpDueDate) < new Date();
      const isDueSoon = c.followUpDueDate &&
                       getDaysUntil(c.followUpDueDate) <= 3;
      const isRecent = daysSince <= 2;

      return isOverdue || isDueSoon || isRecent;
    }).sort((a, b) => {
      // Sort by urgency
      const aOverdue = a.followUpDueDate && new Date(a.followUpDueDate) < new Date();
      const bOverdue = b.followUpDueDate && new Date(b.followUpDueDate) < new Date();

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const aDueSoon = a.followUpDueDate && getDaysUntil(a.followUpDueDate) <= 3;
      const bDueSoon = b.followUpDueDate && getDaysUntil(b.followUpDueDate) <= 3;

      if (aDueSoon && !bDueSoon) return -1;
      if (!aDueSoon && bDueSoon) return 1;

      return new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime();
    });
  }, [contacts]);

  // Extract unique events and industries
  const events = useMemo(
    () => [...new Set(contacts.map((c) => c.event))].sort(),
    [contacts]
  );

  const industries = useMemo(
    () => [...new Set(contacts.map((c) => c.industry).filter(Boolean))].sort(),
    [contacts]
  );

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contactName.toLowerCase().includes(lowerQuery) ||
          c.notes.toLowerCase().includes(lowerQuery) ||
          c.event.toLowerCase().includes(lowerQuery) ||
          c.industry.toLowerCase().includes(lowerQuery) ||
          c.company?.toLowerCase().includes(lowerQuery) ||
          c.email?.toLowerCase().includes(lowerQuery)
      );
    }

    // Event filter
    if (selectedEvent !== "all") {
      filtered = filtered.filter((c) => c.event === selectedEvent);
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((c) => c.industry === selectedIndustry);
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime());
        break;
      case "date-asc":
        filtered.sort((a, b) => new Date(a.taggedAt).getTime() - new Date(b.taggedAt).getTime());
        break;
      case "name-asc":
        filtered.sort((a, b) => a.contactName.localeCompare(b.contactName));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.contactName.localeCompare(a.contactName));
        break;
      case "event":
        filtered.sort((a, b) => a.event.localeCompare(b.event));
        break;
    }

    return filtered;
  }, [contacts, searchQuery, selectedEvent, selectedIndustry, sortBy]);

  const handleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    deleteMultipleContacts(selectedContacts);
    toast.success(`Deleted ${selectedContacts.length} contacts`);
    setSelectedContacts([]);
    setShowDeleteDialog(false);
  };

  const handleExportCSV = () => {
    exportContactsCSV();
    toast.success("Contacts exported as CSV");
  };

  const handleExportAllVCards = () => {
    filteredContacts.forEach((contact) => exportContactVCard(contact.id));
    toast.success(`Exported ${filteredContacts.length} vCard${filteredContacts.length !== 1 ? 's' : ''}`);
  };

  const handleExportSelectedVCards = () => {
    if (selectedContacts.length > 0) {
      exportMultipleVCards(selectedContacts);
      toast.success(`Exported ${selectedContacts.length} vCard${selectedContacts.length !== 1 ? 's' : ''}`);
    }
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setShowTagModal(true);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    toast.success("Contact deleted");
  };

  const dockItems = [
    {
      icon: <QrCode size={20} />,
      label: "Profile",
      onClick: () => navigate("/"),
    },
    {
      icon: <Users size={20} />,
      label: "Contacts",
      onClick: () => navigate("/contacts"),
      className: "bg-accent/30",
    },
    {
      icon: <Calendar size={20} />,
      label: "Events",
      onClick: () => navigate("/events"),
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <div ref={mainContentRef} className="flex-1 container mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Network</h1>
            <p className="text-muted-foreground mt-1">
              {contacts.length} total connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingContact(null);
                setShowTagModal(true);
              }}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Contact
            </Button>
            <ExportMenu
              onExportCSV={handleExportCSV}
              onExportVCards={handleExportAllVCards}
            />
          </div>
        </div>

        {/* Priority Queue - Needs Attention */}
        {priorityContacts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Needs Attention</h2>
                  <p className="text-muted-foreground">
                    {priorityContacts.length} contact{priorityContacts.length !== 1 ? 's' : ''} requiring immediate action
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <Badge variant="secondary">{priorityContacts.length}</Badge>
              </Button>
            </div>
            <ContactsPriorityQueue contacts={priorityContacts} />
          </motion.section>
        )}

        {/* Insights Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ContactsInsights contacts={contacts} />
        </motion.section>

        {/* Event-Based Organization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                📅
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">By Event</h2>
                <p className="text-muted-foreground">Organize contacts by networking events</p>
              </div>
            </div>
          </div>
          <ContactsByEvent contacts={contacts} />
        </motion.section>

        {/* All Contacts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                👥
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Contacts</h2>
                <p className="text-muted-foreground">
                  {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} in your network
                  {selectedContacts.length > 0 && ` (${selectedContacts.length} selected)`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ContactSearchBar value={searchQuery} onChange={setSearchQuery} />
              <ContactFilters
                events={events}
                industries={industries}
                selectedEvent={selectedEvent}
                selectedIndustry={selectedIndustry}
                sortBy={sortBy}
                onEventChange={setSelectedEvent}
                onIndustryChange={setSelectedIndustry}
                onSortChange={setSortBy}
                onClearFilters={() => {
                  setSelectedEvent("all");
                  setSelectedIndustry("all");
                  setSearchQuery("");
                }}
              />
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 mb-6"
            >
              <Checkbox
                checked={selectedContacts.length === filteredContacts.length}
                onCheckedChange={handleSelectAll}
                className="border-accent"
              />
              <span className="text-foreground font-medium">
                {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={handleExportSelectedVCards}
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-accent/20"
                >
                  <Download className="h-4 w-4" />
                  Export vCards
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2"
                >
                  🗑️ Delete Selected
                </Button>
              </div>
            </motion.div>
          )}

          {/* Contacts Grid */}
          {filteredContacts.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title={searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                ? "No contacts found"
                : "Your network is empty"}
              description={searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start building meaningful connections! Your networking journey begins with the first QR scan."}
              action={
                <>
                  {!searchQuery && selectedEvent === "all" && selectedIndustry === "all" && (
                    <Button onClick={() => navigate("/")} className="gap-2">
                      <QrCode className="h-4 w-4" />
                      Go to Profile
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingContact(null);
                      setShowTagModal(true);
                    }}
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Contact
                  </Button>
                </>
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredContacts.map((contact, index) => (
                <div key={contact.id} className="relative">
                  {selectedContacts.length > 0 && (
                    <div className="absolute -top-2 -left-2 z-20">
                      <div className="bg-background border-2 border-accent rounded-full p-1 shadow-lg">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                          className="border-accent data-[state=checked]:bg-accent"
                        />
                      </div>
                    </div>
                  )}
                  <ContactCard
                    contact={contact}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onExport={exportContactVCard}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </motion.section>
      </div>

      {/* Adaptive Navigation */}
      {dockVisible && (
        isMobile ? (
          <MobileTabBar items={dockItems} />
        ) : (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock
                items={dockItems}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </motion.div>
        )
      )}

      {/* Dock Visibility Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDockVisible(!dockVisible)}
          className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {dockVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Tag/Edit Modal */}
      <ContactTagModal
        open={showTagModal}
        onOpenChange={(open) => {
          setShowTagModal(open);
          if (!open) setEditingContact(null);
        }}
        profileCardId=""
        editContact={editingContact}
        onSuccess={() => {
          setEditingContact(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedContacts.length} contacts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All selected contacts will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactsPage;
