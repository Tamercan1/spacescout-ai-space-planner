import api from "./axios";
import type { SpacePlan, SpacePlanRequest } from "../types/planner";


export async function createSpacePlan(prompt: string): Promise<SpacePlan> {

    // USER PROMPT
    const data: SpacePlanRequest = {
        prompt
    }

    // send to backend
    const response = await api.post("/plans/create/", data);

    // backend response
    return response.data;
}

// function to get all the space plans of the user
export async function getSpacePlans(): Promise<SpacePlan[]> {
    const response = await api.get<SpacePlan[]>("/plans/");

    return response.data;
}


export async function getSpacePlan(pk: number): Promise<SpacePlan> {
    const response = await api.get<SpacePlan>(`/plans/${pk}/`);

    return response.data;
}


export async function deleteSpacePlan(pk: number): Promise<void>{
    await api.delete(`/plans/${pk}/`);
}