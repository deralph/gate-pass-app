// components/Button.tsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  admin?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  title,
  onPress,
  loading = false,
  admin = false,
  disabled = false,
  className = '',
  variant = 'primary',
}: ButtonProps) {
  const bgColor = admin? "bg-[#34A75E]":variant === 'primary' ? 'bg-blue-600' : 'bg-white';
  const textColor = variant === 'primary' ? 'text-white' : 'text-blue-600';
  
  return (
    <TouchableOpacity
      className={`${bgColor} py-4 rounded-lg justify-center items-center ${disabled ? 'opacity-50' : ''} ${variant === 'primary' ? '' : 'border border-[#2563eb]'}  ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} />
      ) : (
        <Text className={`${textColor} font-semibold text-xl`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}