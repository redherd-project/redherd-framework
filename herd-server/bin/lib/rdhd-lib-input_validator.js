'use strict';

class InputValidator
{
    static _validateField(value, regex)
    {
        let result = false;
        try
        {
            if (value && regex.test(value))
            {
                result = true;
            }
        }
        catch
        {
            result = false;
        }
        return result;
    }

    static _validateMD5orSHA1(value)
    {
        return InputValidator._validateField(value, /^[a-f0-9]{32,40}$/i);
    }

    static validateNumber(value)
    {
        return InputValidator._validateField(value, /^[0-9]+$/i);
    }

    static validateBinaryNumber(value)
    {
        return InputValidator._validateField(value, /^[0-1]+$/i);
    }

    static validateFileName(value)
    {
        return InputValidator._validateField(value, /^[\w\-. ]+$/i);
    }

    static validateName(value)
    {
        // Note: a name must start with a letter
        return InputValidator._validateField(value, /^[a-z][a-z0-9_\-]*$/i);
    }

    static validateDescription(value)
    {
        return InputValidator._validateField(value, /^[a-z0-9\-_\s]+$/i);
    }

    static validateIp(value)
    {
        return InputValidator._validateField(value, /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    }

    static validateIpRange(value)
    {
        return InputValidator._validateField(value, /^(([(\d+)(x+)]){1,3})(\-+([(\d+)(x)]{1,3}))?\.(([(\d+)(x+)]){1,3})(\-+([(\d+)(x)]{1,3}))?\.(([(\d+)(x+)]){1,3})(\-+([(\d+)(x)]{1,3}))?\.(([(\d+)(x+)]){1,3})(\-+([(\d+)(x)]{1,3}))?$/);
    }

    static validateCIDR(value)
    {
        return InputValidator._validateField(value, /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/);
    }

    static validateHost(value)
    {
        return ((InputValidator.validateIp(value) || InputValidator.validateHostname(value)) ? true : false);
    }

    static validateHostname(value)
    {
        return InputValidator._validateField(value, /^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/);
    }

    static validateUser(value)
    {
        return InputValidator._validateField(value, /^[a-z0-9\-_]+$/i);
    }

    static validateId(value)
    {
        return InputValidator.validateNumber(value);
    }

    static validateFingerprint(value)
    {
        return InputValidator._validateMD5orSHA1(value);
    }

    static validateSessionId(value)
    {
        return InputValidator._validateMD5orSHA1(value);
    }

    static validateTcpUdpPort(value)
    {
        return InputValidator._validateField(value, /^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$/);
    }

    static validateTcpUdpPortRange(value)
    {
        // Note: 1-1024
        return InputValidator._validateField(value, /^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])-()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$/);
    }

    static validateTcpUdpPortSubset(value)
    {
        // Note: 1-1024,3000,5000-8080
        let separator = ",";
        let port = value.split(separator);
        for (let i in port)
        {
            if (!(InputValidator.validateTcpUdpPort(port[i]) || InputValidator.validateTcpUdpPortRange(port[i])))
            {
                return false;
            }
        }

        return true;
    }

    static validateSslPath(value)
    {
        return InputValidator._validateField(value, /^\/([A-z0-9-_+]+\/)*([A-z0-9]+\.(pem|crt|cer|key|p7b|p7c|der|pfx|p12))$/);
    }

    static validateWindowsPath(value)
    {
        return InputValidator._validateField(value, /^([A-Za-z]:|[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*)((\/[A-Za-z0-9_.-]+)+)$/);
    }

    static validateLinuxPath(value)
    {
        return InputValidator._validateField(value, /^(\/[^\/ ]*)+\/?$/);
    }

    static validateBool(value)
    {
        return InputValidator._validateField(value, /^(?:(1|y(?:es)?|t(?:rue)?|on)|(0|n(?:o)?|f(?:alse)?|off))$/);
    }

    static validatePositiveBool(value)
    {
        return InputValidator._validateField(value, /^(?:(1|y(?:es)?|t(?:rue)?|on))$/);
    }

    static validateNegativeBool(value)
    {
        return InputValidator._validateField(value, /^(?:(0|n(?:o)?|f(?:alse)?|off))$/);
    }

    static validateSSID(value)
    {
        return InputValidator._validateField(value, /^[^!#;+\]\/"\t][^+\]\/"\t]{0,30}[^ !#;+\]\/"\t]$|^[^ !#;+\]\/"\t]$/);
    }

    static validateURL(value)
    {
        return InputValidator._validateField(value, /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/);
    }
}

module.exports = InputValidator;