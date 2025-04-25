import { ReactNode } from "react";
import { Pressable } from "react-native";
import Modal from "react-native-modal";
import { AppText } from "./AppText";
import { AppView } from "./AppView";

interface IModalProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
}

export function AppModal({ isOpen, setOpen, children }: IModalProps) {
    const toggleModal = () => {
        setOpen(!isOpen);
    };

    return (
        <AppView style={{ flex: 1 }}>
            <Modal
                isVisible={isOpen}
                // deviceWidth={Dimensions.get("window").width}
                // deviceHeight={Dimensions.get("window").height}
            >
                <AppView style={{ flex: 1, borderRadius: 16, padding: 16 }}>
                    <Pressable onPress={toggleModal}>
                        <AppText>x</AppText>
                    </Pressable>
                    {/* <Button title="Hide modal" onPress={toggleModal} /> */}
                    {children}
                </AppView>
            </Modal>
        </AppView>
    );
}
