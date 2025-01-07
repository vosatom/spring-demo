interface ListItemProps
  extends Pick<React.DOMAttributes<HTMLButtonElement>, 'onClick'> {
  iconColor: string;
  label: string;
  rightElement?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  iconColor,
  label,
  rightElement,
  onClick,
}) => (
  <button
    type="button"
    className="flex items-center justify-between bg-gray-800 rounded-lg p-3 cursor-pointer active:bg-gray-700 w-full border-0 js-no-drag"
    onClick={onClick}
  >
    <div className="text-white flex items-center">
      <span className={`w-6 h-6 rounded-full mr-4 ${iconColor}`}></span>
      {label}
    </div>
    {rightElement}
  </button>
);
