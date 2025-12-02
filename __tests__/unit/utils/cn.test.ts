import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-2', 'py-1', 'bg-red-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-red-500');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('handles false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).not.toContain('active-class');
  });

  it('handles undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toContain('base-class');
    expect(result).toContain('valid-class');
  });

  it('merges Tailwind classes with conflicts correctly', () => {
    // Later classes should override earlier ones
    const result = cn('px-2', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });
});

