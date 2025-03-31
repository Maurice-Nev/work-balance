import React from "react";

const Logo = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      id="Ebene_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 8.7 8.1"
      fill="currentColor"
      width={24}
      height={24}
      {...props}
    >
      <defs></defs>
      <path
        id="Pfad_1"
        className="st0"
        d="M1.7,2.6v-.8h4.6c.1,0,.3,0,.4.2,0,0,.2.3.2.4v.8c0,.3-.2.6-.6.6h-3.6l3.6,4.2h2l-2.2-2.4h.2c.3,0,.6,0,.9-.2s.5-.3.7-.5c.2-.2.4-.5.5-.8.1-.3.2-.6.2-.9v-.8c0-.3,0-.6-.2-.9,0-.3-.3-.6-.5-.8s-.5-.4-.7-.5c-.3-.1-.6-.2-.9-.2H0v.6l1.7,1.9h0Z"
      />
    </svg>
  );
};
export default React.memo(Logo);
