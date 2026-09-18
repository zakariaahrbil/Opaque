package org.zalmoxis.opaque.Exceptions;

public class UnauthorizedAccessException
        extends RuntimeException
{
    public UnauthorizedAccessException(String message)
    {
        super(message);
    }
}
