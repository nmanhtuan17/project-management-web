import { X } from 'lucide-react';
import { IReactMultiEmailProps, ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

interface Props extends Partial<IReactMultiEmailProps> {
}
export const EmailInput = (props: Props) => {

  return (
    <ReactMultiEmail
      {...props}
      autoFocus={true}
      style={{
        border: 0,
        fontSize: '14px',
        padding: 0
      }}
      getLabel={(email, index, removeEmail) => {
        return (
          <div data-tag key={index}>
            <div data-tag-item>{email}</div>
            <span data-tag-handle onClick={() => removeEmail(index)}>
              <X size={14} />
            </span>
          </div>
        );
      }}
    />
  )
}