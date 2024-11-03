import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { useLanguage } from "../app/LanguageContext";
import { useRouter } from "next/navigation";

const PropertyDeleteButton = ({ property, toPropertyResults = () => {} }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const texts = {
    es: {
      deleteProperty: "Eliminar propiedad",
      areYouSure: "¿Está seguro?",
      deleteConfirmation:
        "¿Está seguro que desea eliminar esta propiedad? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirm: "Confirmar",
      deleteSuccess: "Propiedad eliminada exitosamente",
      deleteError: "Error al eliminar la propiedad",
    },
    en: {
      deleteProperty: "Delete property",
      areYouSure: "Are you sure?",
      deleteConfirmation:
        "Are you sure you want to delete this property? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Confirm",
      deleteSuccess: "Property deleted successfully",
      deleteError: "Error deleting property",
    },
  };

  useEffect(() => {
    if (auth) {
      const decodedToken = jwtDecode(auth);
      setIsAdmin(decodedToken.role === "ADMIN");
    }
  }, [auth]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const decodedToken = jwtDecode(auth);
      const email = decodedToken.email;

      const response = await fetch("/api/deleteProperty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          email,
        }),
      });

      if (response.status === 200) {
        toast.success(texts[language].deleteSuccess);
        setShowModal(false);

        const propertiesResponse = await fetch("/api/getProperties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters: {} }),
        });

        if (!propertiesResponse.ok) {
          throw new Error(`HTTP error! status: ${propertiesResponse.status}`);
        }

        const updatedProperties = await propertiesResponse.json();
        toPropertyResults(updatedProperties);
      } else {
        throw new Error(texts[language].deleteError);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowModal(true)}
        className="me-2"
      >
        {texts[language].deleteProperty}
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop={false}
        className="modal-transparent"
      >
        <Modal.Header closeButton>
          <Modal.Title>{texts[language].areYouSure}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{texts[language].deleteConfirmation}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {texts[language].cancel}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {texts[language].confirm}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .modal-transparent .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default PropertyDeleteButton;
