import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: PaginationProps) {
  
  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}