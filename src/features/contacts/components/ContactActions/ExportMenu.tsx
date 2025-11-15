import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Download, FileText, Contact } from "lucide-react";

interface ExportMenuProps {
  onExportCSV: () => void;
  onExportVCards: () => void;
  selectedCount?: number;
}

export const ExportMenu = ({
  onExportCSV,
  onExportVCards,
  selectedCount = 0,
}: ExportMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export {selectedCount > 0 ? `(${selectedCount})` : "All"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportVCards}>
          <Contact className="h-4 w-4 mr-2" />
          Export as vCard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
