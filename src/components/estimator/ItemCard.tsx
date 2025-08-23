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
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getTypeColor()}>
                {item.type}
              </Badge>
              {item.quantity > 1 && (
                <Badge variant="outline">
                  Qty: {item.quantity}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ₹{item.totalPrice.toLocaleString('en-IN')}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-muted-foreground">
                ₹{item.unitPrice.toLocaleString('en-IN')} each
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dimensions:</span>
            <span className="font-medium">{getDimensionText()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Material:</span>
            <span className="font-medium">{getMaterialDisplayName(item.material)}</span>
          </div>
          
          {item.style && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Style:</span>
              <span className="font-medium capitalize">{item.style}</span>
            </div>
          )}
          
          {item.finish && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finish:</span>
              <span className="font-medium capitalize">{item.finish}</span>
            </div>
          )}
          
          {item.description && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs">{item.description}</p>
            </div>
          )}
        </div>

        {/* Action buttons - only visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDuplicate(item)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};