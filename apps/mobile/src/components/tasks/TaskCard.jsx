import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, ShieldCheck } from 'lucide-react-native';
import { Theme } from '../common/Theme';

export const TaskCard = ({ task, onPress }) => {
  const { title, category, budget, locationName, distanceKm, status } = task;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Top Bar: Category & Status Badge */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={styles.escrowBadge}>
          <ShieldCheck size={14} color={Theme.colors.mpesaGreen} />
          <Text style={styles.escrowText}>M-Pesa Escrow</Text>
        </View>
      </View>

      {/* Main Content */}
      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      {/* Location & Metadata */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MapPin size={14} color={Theme.colors.gray600} />
          <Text style={styles.metaText}>{locationName} ({distanceKm} km away)</Text>
        </View>
      </View>

      {/* Footer: Price Tag */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.budgetLabel}>Offered Pay</Text>
          <Text style={styles.budgetValue}>KES {budget.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.bidButton} onPress={onPress}>
          <Text style={styles.bidButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.gray100,
    // Elevation shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Theme.colors.gray100,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.gray600,
    fontWeight: '600',
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
  },
  escrowText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.mpesaGreen,
    fontWeight: '700',
  },
  title: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.darkNavy,
    marginBottom: Theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.gray600,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray100,
    paddingTop: Theme.spacing.sm,
  },
  budgetLabel: {
    fontSize: 10,
    color: Theme.colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Theme.colors.mpesaGreen,
  },
  bidButton: {
    backgroundColor: Theme.colors.trustBlue,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
  },
  bidButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: Theme.fontSize.sm,
  },
});