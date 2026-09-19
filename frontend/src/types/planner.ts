
export interface Discovery {
    id: number;
    type: string;
    title: string;
    date: string | null;
    summary: string;
    why_interesting: string;
    facts: Record<string, unknown>;
    source: string;
    media_type: string | null;
    media_url: string | null;
}

export interface SpacePlan {
    id: number;
    prompt: string;
    title: string;
    summary: string;
    discoveries: Discovery[];
    created_at: string;
    updated_at: string;
}

export interface SpacePlanRequest {
    prompt: string
}