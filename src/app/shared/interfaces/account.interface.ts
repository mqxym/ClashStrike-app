export interface AccountData { 
    name: string; 
    notificationsEnabled: boolean; 
    buildersUsed: number;
    maxBuilders: number;
    labUsed: number;
    maxLab: number;
    editBuilders: boolean;  
    editLab: boolean;
  }
  
 export interface AccountChangeEvent {
    field: keyof AccountData; // This ensures the field is a valid key of CardData
    value: string;
  }