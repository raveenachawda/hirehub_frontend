import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/${companyId}`, {
          withCredentials: true
        });
        
        if (res.data.success) {
          setCompany(res.data.company);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching company details");
        navigate('/admin/companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,_#ffe5e0,_#f8f8f8,_#ffe5e0)]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Company Details</h1>
            <Button variant="outline" onClick={() => navigate('/admin/companies')}>
              Back to Companies
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {company.logo && (
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="w-32 h-32 rounded-lg object-cover mb-4"
                />
              )}
              <h2 className="text-2xl font-semibold mb-2">{company.name}</h2>
              <p className="text-gray-600 mb-4">{company.description}</p>
              <div className="space-y-2">
                <p><strong>Location:</strong> {company.location}</p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Recruiters</h3>
              {company.recruiters && company.recruiters.length > 0 ? (
                <div className="space-y-2">
                  {company.recruiters.map(recruiter => (
                    <div key={recruiter._id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{recruiter.fullname}</p>
                      <p className="text-gray-600">{recruiter.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recruiters joined yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails; 