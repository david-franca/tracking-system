import { useEffect, useState } from "react";

import { Badge, ThemingProps } from "@chakra-ui/react";

import { Priority, Status } from "../../../@types";

interface BadgesColoredProps {
  title: Priority | Status;
}

const BadgesColored = ({ title }: BadgesColoredProps) => {
  const [color, setColor] = useState<ThemingProps["colorScheme"]>("");

  useEffect(() => {
    switch (title) {
      case Priority.ALTA:
        setColor('red')
        break;
      case Priority.BAIXA:
        setColor('green')
        break;
      case Priority.NORMAL:
        setColor('cyan')
        break;
      case Status.APROVADO:
        setColor('green')
        break;
      case Status.DUPLICADO:
        setColor('yellow')
        break;
      case Status.NAO_E_ERRO:
        setColor('teal')
        break;
      case Status.NAO_SERA_REMOVIDO:
        setColor('gray')
        break;
      case Status.NOVO:
        setColor('blue')
        break;
      case Status.REPROVADO:
        setColor('red')
        break;
      case Status.RESOLVIDO:
        setColor('whatsapp')
        break;
      default:
        break;
    }
  }, [title]);

  return <Badge colorScheme={color}>{title}</Badge>;
};

export default BadgesColored;
