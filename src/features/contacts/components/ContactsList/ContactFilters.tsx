import { Label } from "@shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Button } from "@shared/ui/button";
import { X } from "lucide-react";

interface ContactFiltersProps {
  events: string[];
  industries: string[];
  selectedEvent: string;
  selectedIndustry: string;
  sortBy: string;
  onEventChange: (event: string) => void;
  onIndustryChange: (industry: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export const ContactFilters = ({
  events,
  industries,
  selectedEvent,
  selectedIndustry,
  sortBy,
  onEventChange,
  onIndustryChange,
  onSortChange,
  onClearFilters,
}: ContactFiltersProps) => {
  const hasActiveFilters = selectedEvent !== "all" || selectedIndustry !== "all";

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto p-1 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Event Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Event</Label>
          <Select value={selectedEvent} onValueChange={onEventChange}>
            <SelectTrigger>
              <SelectValue placeholder="All events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Industry</Label>
          <Select value={selectedIndustry} onValueChange={onIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm">Sort by</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
