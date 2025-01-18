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
  currentEmailLabel: string;
  loadMails?: () => void;
}

const MailContext = createContext<MailContextType>({
  loading: false,
  emails: [],
  currentEmailLabel: ''
});

export const useMailContext = () => useContext(MailContext);

export default function MailPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const { pathname } = useLocation();
  const [loadingEmails, setLoadingEmails] = useState(false);
  const currentEmailLabel = pathname.split("/")[2];
  const { user } = useAppSelector(state => state.auth);


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
    setLoadingEmails(true)
    if (!user.internalEmail) return;
    const res = await apiService.get(`mails/${MessageStreams[currentEmailLabel]}`)
    setEmails(res.data.messages.map(email => ({
      ...email,
      From: email.From.replace(/[<>]/g, "")
    })))
    setLoadingEmails(false)
  };

  useEffect(() => {
    handleLoadEmails().then();
  }, [currentEmailLabel]);


  return (
    <MailContext.Provider
      value={{
        loading: loadingEmails,
        emails,
        currentEmailLabel,
        loadMails: handleLoadEmails,
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
