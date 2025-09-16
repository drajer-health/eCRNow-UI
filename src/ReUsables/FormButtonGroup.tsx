import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { FormButtonGroupProps } from "../Models/PublicHealthAuthority.model";


const FormButtonGroup: React.FC<FormButtonGroupProps> = ({ label, onClick, type = "button", className,
}) => (
  <Form.Group as={Row}>
    <Col>
      <Button type={type} onClick={onClick} className={className}>
        {label}
      </Button>
    </Col>
  </Form.Group>
);

export default FormButtonGroup;

