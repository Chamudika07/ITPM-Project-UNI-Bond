export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  location: string;
  logoUrl?: string;
  website?: string;
}

const getInitialCompanies = (): Company[] => {
  const stored = localStorage.getItem('mock_companies');
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultCompanies: Company[] = [
    {
      id: "c1",
      name: "WSO2",
      industry: "Enterprise Software",
      description: "WSO2 provides open-source, API-first transformation technologies.",
      location: "Colombo, Sri Lanka",
      website: "https://wso2.com"
    },
    {
      id: "c2",
      name: "Sysco LABS",
      industry: "Food Technology",
      description: "Sysco LABS is the innovation arm of Sysco Corporation.",
      location: "Colombo, Sri Lanka",
      website: "https://syscolabs.lk"
    },
    {
      id: "c3",
      name: "99x",
      industry: "Software Engineering",
      description: "We partner with European businesses to co-create mature digital products.",
      location: "Colombo, Sri Lanka",
      website: "https://99x.io"
    }
  ];
  localStorage.setItem('mock_companies', JSON.stringify(defaultCompanies));
  return defaultCompanies;
};

export const mockGetCompanies = async (): Promise<Company[]> => {
  return [...getInitialCompanies()];
};

export const mockGetCompanyById = async (id: string): Promise<Company | undefined> => {
  const all = getInitialCompanies();
  return all.find(c => c.id === id);
};

export const mockAddCompany = async (company: Company): Promise<void> => {
   const all = getInitialCompanies();
   if (!all.find(c => c.id === company.id)) {
      all.push(company);
      localStorage.setItem('mock_companies', JSON.stringify(all));
   }
};
