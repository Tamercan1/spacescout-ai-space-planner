
export function formatToShortDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";

    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) {
        console.error(`Invalid date string passed: ${dateStr}`);
        return "";
    }

    // 3. Return the formatted value ("Sep 15")
    const formatted = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit" 
    });

    return formatted.toUpperCase();
}
