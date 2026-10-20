import { describe, expect, it } from 'vitest';
import { planFeatures, resolveCycle, subscriptionCycle, toApiPlan } from '../utils/plans';

const options = (...keys) => Object.fromEntries(keys.map((key) => [key, { id: key }]));

describe('resolveCycle', () => {
  it('defaults to monthly', () => {
    expect(resolveCycle({ chosen: null, subscriptionPlan: null, planOptions: null })).toBe('monthly');
  });

  it("follows the member's plan until the user picks one", () => {
    const planOptions = options('monthly', 'yearly');
    expect(resolveCycle({ chosen: null, subscriptionPlan: 'YEARLY', planOptions })).toBe('yearly');
    expect(resolveCycle({ chosen: 'monthly', subscriptionPlan: 'YEARLY', planOptions })).toBe(
      'monthly',
    );
  });

  it('falls back to the first offered plan', () => {
    expect(
      resolveCycle({ chosen: null, subscriptionPlan: null, planOptions: options('yearly') }),
    ).toBe('yearly');
  });
});

describe('plan helpers', () => {
  it('only maps monthly and yearly plans to a cycle', () => {
    expect(subscriptionCycle('MONTHLY')).toBe('monthly');
    expect(subscriptionCycle('LIFETIME')).toBeNull();
    expect(subscriptionCycle(undefined)).toBeNull();
  });

  it('maps cycles to API plans', () => {
    expect(toApiPlan('yearly')).toBe('YEARLY');
    expect(toApiPlan('weekly')).toBe('WEEKLY');
  });

  it('prefers the shared feature list', () => {
    expect(planFeatures({ features: ['a'] }, { features: ['b'] })).toEqual(['a']);
    expect(planFeatures({}, { features: ['b'] })).toEqual(['b']);
    expect(planFeatures(null, null)).toEqual([]);
  });
});
