import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormRadioGroupProps } from "../../src/Models/PublicHealthAuthority.model";

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ label, name, value, options, onChange, isInvalid = false, feedback, required = true,
}) => {
    return (
        <Form.Group as={Row} controlId={`formRadioGroup-${name}`}>
            <Form.Label column sm={2}>
                {label}
            </Form.Label>
            <Col sm={10}>
                <Row>
                    {options.map((option) => (
                        <Col sm={4} key={option.id}>
                            <Form.Check type="radio" id={option.id}>
                                <Form.Check.Input
                                    type="radio"
                                    checked={value === option.value}
                                    value={option.value}
                                    name={name}
                                    onChange={onChange}
                                    isInvalid={isInvalid}
                                    required={required}
                                />
                                <Form.Check.Label>{option.label}</Form.Check.Label>
                            </Form.Check>
                        </Col>
                    ))}
                </Row>
                {isInvalid && feedback && (
                    <Form.Control.Feedback type="invalid">
                        {feedback}
                    </Form.Control.Feedback>
                )}
            </Col>
        </Form.Group>
    );
};

export default FormRadioGroup;