import { Button } from "./Button";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0F2D4A]">{title}</h2>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}