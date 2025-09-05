/* ITEM CARD COMPONENT COMMENTED OUT
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EstimatorItem } from './types';
import { getMaterialDisplayName } from './PricingEngine';
import { Edit, Trash2, Copy } from 'lucide-react';

interface ItemCardProps {
  item: EstimatorItem;
  onEdit: (item: EstimatorItem) => void;
  onDelete: (itemId: string) => void;
  onDuplicate: (item: EstimatorItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const getDimensionText = () => {
    const { width, height, depth, unit } = item.dimensions;
    const unitText = unit === 'ft' ? "'" : '"';
    
    if (depth && item.type === 'custom') {
      return `${width}${unitText} × ${height}${unitText} × ${depth}${unitText}`;
    }
    return `${width}${unitText} × ${height}${unitText}`;
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'door':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'window':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'custom':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="group relative hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-timber-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg mb-2 truncate pr-2 leading-tight">{item.name}</CardTitle>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge className={`${getTypeColor()} text-xs font-medium`}>
                {item.type}
              </Badge>
              {item.quantity > 1 && (
                <Badge variant="outline" className="text-xs">
                  Qty: {item.quantity}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg md:text-xl font-bold text-timber-600">
              ₹{item.totalPrice.toLocaleString('en-IN')}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs md:text-sm text-gray-500">
                ₹{item.unitPrice.toLocaleString('en-IN')} each
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Dimensions:</span>
            <span className="font-medium text-right">{getDimensionText()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Material:</span>
            <span className="font-medium text-right truncate ml-2">{getMaterialDisplayName(item.material)}</span>
          </div>
          
          {item.style && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Style:</span>
              <span className="font-medium capitalize text-right truncate ml-2">{item.style}</span>
            </div>
          )}
          
          {item.finish && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Finish:</span>
              <span className="font-medium capitalize text-right truncate ml-2">{item.finish}</span>
            </div>
          )}
          
          {item.description && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>

        {/* Mobile-first action buttons */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 px-3 text-xs hover:bg-blue-50 hover:border-blue-200"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDuplicate(item)}
              className="h-8 px-3 text-xs hover:bg-green-50 hover:border-green-200"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(item.id)}
              className="h-8 px-3 text-xs text-destructive hover:bg-red-50 hover:border-red-200 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
*/
/* END ITEM CARD COMPONENT COMMENTED OUT */