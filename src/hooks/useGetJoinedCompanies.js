import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { setJoinedCompanies } from '@/redux/companySlice';
import { toast } from 'sonner';

const useGetJoinedCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJoinedCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/joined`, {
          withCredentials: true
        });
        
        if (res.data.success) {
          dispatch(setJoinedCompanies(res.data.companies));
        }
      } catch (error) {
        console.error('Error fetching joined companies:', error);
        toast.error(error.response?.data?.message || 'Error fetching joined companies');
      }
    };

    fetchJoinedCompanies();
  }, [dispatch]);
};

export default useGetJoinedCompanies; 