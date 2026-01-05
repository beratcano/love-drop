// Shared color palette for course scheduling
export const COURSE_COLORS = [
    { bg: '#fee2e2', border: '#ef4444', text: '#b91c1c', solid: '#ef4444' }, // Red
    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', solid: '#3b82f6' }, // Blue
    { bg: '#dcfce7', border: '#22c55e', text: '#15803d', solid: '#22c55e' }, // Green
    { bg: '#f3e8ff', border: '#a855f7', text: '#7e22ce', solid: '#a855f7' }, // Purple
    { bg: '#ffedd5', border: '#f97316', text: '#c2410c', solid: '#f97316' }, // Orange
    { bg: '#fce7f3', border: '#ec4899', text: '#be185d', solid: '#ec4899' }, // Pink
];

// Get consistent color for a course based on its ID
export function getCourseColor(courseId: string) {
    const hash = courseId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = hash % COURSE_COLORS.length;
    return COURSE_COLORS[index];
}
