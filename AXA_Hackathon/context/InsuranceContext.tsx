import React, { createContext, useContext, useState } from 'react';

interface InsuranceData {
  photo?: string;
  vehicleDetails?: {
    model: string;
    year: string;
    manufacturer: string;
  };
  usage?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    parking?: string;
  };
}

interface InsuranceContextProps {
  data: InsuranceData;
  setData: (newData: Partial<InsuranceData>) => void;
  resetData: () => void;
}

const InsuranceContext = createContext<InsuranceContextProps | undefined>(undefined);

export const InsuranceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<InsuranceData>({});

  const setData = (newData: Partial<InsuranceData>) => {
    setDataState((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setDataState({});
  };

  return (
    <InsuranceContext.Provider value={{ data, setData, resetData }}>
      {children}
    </InsuranceContext.Provider>
  );
};

export const useInsurance = () => {
  const context = useContext(InsuranceContext);
  if (!context) {
    throw new Error('useInsurance must be used within an InsuranceProvider');
  }
  return context;
};