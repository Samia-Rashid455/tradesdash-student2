export const colors = {
  navy900: '#14263F',
  navy700: '#1F3A5F',
  navy50: '#E8EEF5',
  orange500: '#E07B20',
  orange50: '#FDF1E3',
  pageBg: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#D9E0E8',
  text: '#1B2430',
  muted: '#5B6776',
  success: '#15803D',
  warning: '#F59E0B',
  danger: '#B91C1C',
  info: '#2563EB',
  whatsapp: '#25D366',
}

// Tenant (admin) statuses: Active = green, Trial = blue, Suspended = red
export const tenantStatusColor = {
  Active: colors.success,
  Trial: colors.info,
  Suspended: colors.danger,
}

export const antdTheme = {
  token: {
    colorPrimary: colors.navy700,
    colorLink: colors.navy700,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.danger,
    colorInfo: colors.info,
    colorBgLayout: colors.pageBg,
    colorBgContainer: colors.surface,
    colorBorder: colors.border,
    colorBorderSecondary: colors.border,
    colorText: colors.text,
    colorTextSecondary: colors.muted,
    colorTextPlaceholder: colors.muted,
    borderRadius: 8,
  },
  components: {
    Layout: {
      siderBg: colors.navy900,
      headerBg: colors.surface,
      bodyBg: colors.pageBg,
    },
    Menu: {
      darkItemBg: colors.navy900,
      darkItemColor: '#C9D3E0',
      darkItemHoverBg: colors.navy700,
      darkItemSelectedBg: colors.navy700,
      darkItemSelectedColor: '#FFFFFF',
    },
    Table: {
      headerBg: colors.navy50,
      headerColor: colors.navy700,
      rowHoverBg: colors.navy50,
      rowSelectedBg: colors.navy50,
      borderColor: colors.border,
    },
    Card: {
      colorBorderSecondary: colors.border,
    },
  },
}