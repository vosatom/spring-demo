import { ListItem } from '@/components/ListItem';
import { useStackStore } from '@/stores/useStackStore';
import CaretRight from '../icons/CaretRight';

export const Home = () => {
  const viewsStack = useStackStore();
  return (
    <div className="space-y-4">
      <ListItem
        iconColor="bg-yellow-500"
        label="Airplane Mode"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('settings');
        }}
      />
      <ListItem
        iconColor="bg-blue-500"
        label="Wi-Fi"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('wifi');
        }}
      />
      <ListItem
        iconColor="bg-green-500"
        label="Bluetooth"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('settings');
        }}
      />
      <ListItem
        iconColor="bg-red-500"
        label="Cellular"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('settings');
        }}
      />
      <ListItem
        iconColor="bg-purple-500"
        label="Personal Hotspot"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('settings');
        }}
      />
      <ListItem
        iconColor="bg-pink-500"
        label="VPN"
        rightElement={<CaretRight className="text-gray-400" size={24} />}
        onClick={() => {
          viewsStack.pushView('settings');
        }}
      />
    </div>
  );
};
