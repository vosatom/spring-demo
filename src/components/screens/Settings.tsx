import { ListItem } from '@/components/ListItem';
import { useStackStore } from '@/stores/useStackStore';
import CaretRight from '../icons/CaretRight';

export const Settings = () => {
  const viewsStack = useStackStore();
  return (
    <div className="space-y-4">
      <ListItem
        iconColor="bg-blue-500"
        label="Wi-Fi"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('wifi');
        }}
      />
    </div>
  );
};
