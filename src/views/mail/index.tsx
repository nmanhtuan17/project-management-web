import {Mail} from "@/views/mail/components/mail.tsx"
import {createContext, useContext, useEffect, useState} from "react";
import apiService from "@/services/api.service.ts";
import useApi from "@/lib/hooks/useApi.tsx";
import {Email, EmailAddress, EmailLabel} from "@/types/mail.ts";
import {useLocation} from "react-router-dom";

const initialPagination: Pagination = {
  page: 1,
  totalPages: 1,
  hasNext: false,
}

interface MailContextType {
  loading: boolean;
  emails: Email[];
  // activeEmail?: EmailAddress;
  // emailAddresses: EmailAddress[];
  // setActiveEmail?: (activeEmail: EmailAddress) => void;
  // loadMail?: (mailId: string) => void;
  // pagination: Pagination;
  // setPagination: (pagination: (prevState: Pagination) => {
  //   totalPages: number;
  //   hasNext: boolean;
  //   page: number
  // }) => void;
}

const MailContext = createContext<MailContextType>({
  loading: false,
  emails: [],
  // emailAddresses: [],
  // pagination: initialPagination as Pagination,
  // setPagination: () => {
  // }
});

export const useMailContext = () => useContext(MailContext);

export default function MailPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [activeEmail, setActiveEmail] = useState<EmailAddress>();
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const {pathname} = useLocation();
  const currentEmailLabel = pathname.split("/")[4];
  const [loadingEmails, setLoadingEmails] = useState(false);


  // useEffect(() => {
  //   if (emailAddresses && emailAddresses.length !== 0) {
  //     setActiveEmail(emailAddresses[0]);
  //   }
  // }, [emailAddresses]);

  const loadMail = (mailId: string) => {
    // loadSingleMail(mailId).then(mailDetail => {
    //   if (emails.findIndex(m => m._id === mailDetail._id) < 0) {
    //     setEmails(mails => {
    //       return [mailDetail, ...mails];
    //     });
    //   }
    // });
  };

  // const handleLoadEmails = async (page: number) => {
  //   if (!activeEmail) return;
  //   if (pagination.page === 1) setLoadingEmails(true);
  //   const currentEmail = `${activeEmail.alias}@${activeEmail.domainString}`;
  //   const queries = {
  //     address: currentEmail,
  //     labels: currentEmailLabel,
  //     page,
  //     limit: 20,
  //   };

  //   try {
  //     const response = await loadEmails(space._id, queries);
  //     setEmails(prevEmails => {
  //       const newEmails = response.data.filter(
  //         (email: Email) => !prevEmails.some(existingMail => existingMail._id === email._id)
  //       );
  //       return [...prevEmails, ...newEmails];
  //     });
  //     setPagination(response.pagination);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoadingEmails(false);
  //   }
  // };

  // useEffect(() => {
  //   setEmails([]);
  //   handleLoadEmails(1).then();
  // }, [activeEmail, currentEmailLabel]);

  // useEffect(() => {
  //   handleLoadEmails(pagination.page).then();
  // }, [pagination.page]);

  return (
    <MailContext.Provider
      value={{
        loading: loadingEmails,
        emails,
        // activeEmail,
        // emailAddresses,
        // setActiveEmail,
        // loadMail,
        // pagination,
        // setPagination,
      }}>
      <div className="flex-col flex flex-1 min-h-0">
        <Mail
          defaultLayout={[265, 440, 655]}
          navCollapsedSize={4}
        />
      </div>
    </MailContext.Provider>
  )
}
