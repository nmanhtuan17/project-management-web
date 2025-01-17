import { Mail } from "@/views/mail/components/mail.tsx"
import { createContext, useContext, useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import useApi from "@/lib/hooks/useApi.tsx";
import { Email, EmailAddress, EmailLabel, MessageStreams } from "@/types/mail.ts";
import { useLocation } from "react-router-dom";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import { useAppSelector } from "@/redux/store";

const initialPagination: Pagination = {
  page: 1,
  totalPages: 1,
  hasNext: false,
}

interface MailContextType {
  loading: boolean;
  emails: Email[];
  loadMail?: (mailId: string) => void;
}

const MailContext = createContext<MailContextType>({
  loading: false,
  emails: [],
});

export const useMailContext = () => useContext(MailContext);

export default function MailPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const { pathname } = useLocation();
  const [loadingEmails, setLoadingEmails] = useState(false);
  const currentEmailLabel = pathname.split("/")[2];
  const { user } = useAppSelector(state => state.auth);

  console.log(MessageStreams[currentEmailLabel])

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

  const handleLoadEmails = async () => {
    if (!user.internalEmail) return;
    const res = await apiService.get(`mails/${MessageStreams[currentEmailLabel]}`)
    setEmails(res.data.Messages)
  };

  useEffect(() => {
    handleLoadEmails().then();
  }, [currentEmailLabel]);


  return (
    <MailContext.Provider
      value={{
        loading: loadingEmails,
        emails,
        loadMail
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
