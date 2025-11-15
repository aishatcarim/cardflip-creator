import { useState, useMemo } from "react";
import { useNetworkContactsStore } from "../store/networkContactsStore";
import { AppHeader } from '@shared/components';
import { ContactSearchBar } from "../components/ContactsList/ContactSearchBar";
import { ContactFilters } from "../components/ContactsList/ContactFilters";
import { ContactCard } from "../components/ContactsList/ContactCard";
import { ContactTagModal } from "../components/ContactActions/ContactTagModal";
import { ExportMenu } from "../components/ContactActions/ExportMenu";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Users, LayoutGrid, QrCode, Trash2, Download, UserPlus, BarChart3, Calendar, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dock } from '@shared/components';
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
      label: "QR Showcase",
      onClick: () => navigate("/"),
    },
    {
      icon: <LayoutGrid size={20} />,
      label: "Card Builder",
      onClick: () => navigate("/cards"),
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

      <div className="flex-1 container mx-auto px-4 py-6 pb-24">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Network</h1>
              <p className="text-muted-foreground mt-1">
                {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""}
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

          {/* Search */}
          <ContactSearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20"
            >
              <Checkbox
                checked={selectedContacts.length === filteredContacts.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-foreground">
                {selectedContacts.length} selected
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={handleExportSelectedVCards}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export vCard
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
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
              }}
            />
          </aside>

          {/* Contacts Grid */}
          <div className="flex-1">
            {filteredContacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                    ? "No contacts found"
                    : "No contacts yet"}
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {searchQuery || selectedEvent !== "all" || selectedIndustry !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start building your network by tagging contacts when they scan your QR code"}
                </p>
                {!searchQuery && selectedEvent === "all" && selectedIndustry === "all" && (
                  <Button onClick={() => navigate("/")} className="gap-2">
                    <QrCode className="h-4 w-4" />
                    Go to QR Showcase
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredContacts.map((contact, index) => (
                  <div key={contact.id} className="relative">
                    {selectedContacts.length > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                          className="bg-background"
                        />
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dock Navigation */}
      {dockVisible && (
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
