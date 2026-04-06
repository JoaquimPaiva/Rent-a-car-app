import { Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  editable = true,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        keyboardType={keyboardType}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 10 : 12,
          minHeight: multiline ? 92 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
};
