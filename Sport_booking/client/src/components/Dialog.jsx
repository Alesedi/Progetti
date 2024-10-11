import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description }) {    //funzione finestra di dialogo o pop up realizzato usando Material-Ui, libreria di componenti React, accetta varie proprietà
   //open booleano che determina la visibilità o meno del dialogo, onClose funzione per chiudere un dialogo, disableRestore focus impedisce al focus di tornare indietro all'elemento che aveva prima il focus
    return (
        <Dialog open={open} onClose={onClose} disableRestoreFocus>    
            <DialogTitle>{title}</DialogTitle>       
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Annulla
                </Button>
                <Button onClick={onConfirm} color="secondary">
                    Conferma
                </Button>
            </DialogActions>
        </Dialog>
    );
}

//vantaggi: migliora la user experience, chiarezza data da titolo e descrizione che aiutano a chiarire cio che utente sta confermando, CONTROLLO AZIONI, che permettono all'utente di capire se veramente vuole procedere con l'azione